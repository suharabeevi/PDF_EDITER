const express = require("express");
const morgan = require("morgan");
const cors= require("cors")
const cookieParser = require("cookie-parser");

const expressConfig = (app) => {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "http://localhost:5000"
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

module.exports = expressConfig;
