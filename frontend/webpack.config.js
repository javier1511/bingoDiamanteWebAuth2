const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",

  entry: {
    index: "./src/index.js",
    aforo: "./src/aforo.js",
    visitas: "./src/visitas.js",
    datos: "./src/datos.js",
    crm: "./src/crm.js",
    logins: "./src/logins.js",
    cortesias:"./src/cortesias.js",
    cortesiasPorCliente:"./src/cortesiasPorCliente.js",
    reporteDeCortesias:"./src/reporteDeCortesias.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "",
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: ["index.html"],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    // index
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
    }),

    // aforo
    new HtmlWebpackPlugin({
      filename: "aforo.html",
      template: "./src/aforo.html",
      chunks: ["aforo"],
    }),

    // visitas
    new HtmlWebpackPlugin({
      filename: "visitas.html",
      template: "./src/visitas.html",
      chunks: ["visitas"],
    }),

    // datos
    new HtmlWebpackPlugin({
      filename: "datos.html",
      template: "./src/datos.html",
      chunks: ["datos"],
    }),

    // crm
    new HtmlWebpackPlugin({
      filename: "crm.html",
      template: "./src/crm.html",
      chunks: ["crm"],
    }),
      new HtmlWebpackPlugin({
      filename: "logins.html",
      template: "./src/logins.html",
      chunks: ["logins"],
    }),
     new HtmlWebpackPlugin({
      filename: "cortesias.html",
      template: "./src/cortesias.html",
      chunks: ["cortesias"],
    }),
      new HtmlWebpackPlugin({
      filename: "cortesiasPorCliente.html",
      template: "./src/cortesiasPorCliente.html",
      chunks: ["cortesiasPorCliente"],
    }),
    new HtmlWebpackPlugin({
      filename: "reporteDeCortesias.html",
      template: "./src/reporteDeCortesias.html",
      chunks: ["reporteDeCortesias"],
    }),

    // limpia dist en cada build
    new CleanWebpackPlugin(),

    // extrae CSS
    new MiniCssExtractPlugin(),
  ],
};
