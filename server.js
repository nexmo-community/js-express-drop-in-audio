require('dotenv').config();
const express = require("express");
const Vonage = require("@vonage/server-sdk");
const https = require("https");
const fs = require("fs");

const vonage = new Vonage({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.APPLICATION_PRIVATE_KEY
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run("CREATE TABLE Users (id TEXT PRIMARY KEY NOT NULL, name TEXT)");
    console.log("New table user created!");
  } else {
    console.log('Database "Users" ready to go!');
  }
});

app.post("/auth", async (req, res) => {
  const name = req.body.name;

  await getDbUser(name).then(dbUserName => {
    if (dbUserName == null) {
      const body = JSON.stringify({
        name: name,
        display_name: name,
        image_url: "https://example.com/image.png"
      });

      makeRequest("/v0.1/users", "POST", body).then(apiResponse => {
        addDbUser(apiResponse.id, name).then(dbInsertSuccess => {
          res.json({ name: name, jwt: getJwt(name) });
        });
      });
    } else {
      res.json({ name: dbUserName, jwt: getJwt(dbUserName) });
    }
  });
});

app.get("/rooms", async (req, res) => {
  await makeRequest("/v0.2/conversations", "GET").then(apiResponse => {
    const conversations = apiResponse._embedded.data.conversations;
    res.json(
      conversations.map(function(conversation) {
        return { id: conversation.id, display_name: conversation.display_name };
      })
    );
  });
});

app.post("/rooms", async (req, res) => {
  const body = JSON.stringify({
    display_name: req.body.display_name,
    image_url: "https://example.com/image.png",
    properties: { ttl: 300 }
  });

  await makeRequest("/v0.1/conversations", "POST", body).then(apiResponse => {
    res.json({ id: apiResponse.id });
  });
});

async function getDbUser(name) {
  return new Promise((resolve, reject) => {
    if (process.env.CAN_ACCESS_DB) {
      db.get(
        "Select name from Users WHERE name = ? LIMIT 1",
        [name],
        (err, row) => {
          return row ? resolve(row.name) : resolve(null);
        }
      );
    }
  });
}

async function addDbUser(id, name) {
  return new Promise((resolve, reject) => {
    if (process.env.CAN_ACCESS_DB) {
      db.run("INSERT INTO Users (id, name) VALUES (?, ?)", [id, name], err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
  });
}

async function makeRequest(path, method, body) {
  const options = {
    hostname: "api.nexmo.com",
    path: path,
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getJwt()
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      var json = "";

      res.setEncoding("utf8");

      res.on("data", chunk => {
        json += chunk;
      });

      res.on("end", function() {
        try {
          var data = JSON.parse(json);
          resolve(data);
        } catch (e) {
          console.log("Error parsing JSON!");
          reject(e);
        }
      });
    });

    if (body != null) {
      req.write(body);
    }
    req.end();
  });
}

function getJwt(sub) {
  let claims = {
    exp: Math.round(new Date().getTime() / 1000) + 120,
    acl: {
      paths: {
        "/*/users/**": {},
        "/*/conversations/**": {},
        "/*/sessions/**": {},
        "/*/devices/**": {},
        "/*/image/**": {},
        "/*/media/**": {},
        "/*/applications/**": {},
        "/*/push/**": {},
        "/*/knocking/**": {},
        "/*/legs/**": {}
      }
    }
  };

  if (sub != null) {
    claims.sub = sub;
  }

  return vonage.generateJwt(claims);
}

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
