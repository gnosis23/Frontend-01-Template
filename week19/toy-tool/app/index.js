var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

  }

  async collecting() {
    this.answers = await this.prompt({
      type: 'input',
      name: 'title',
      message: 'Your project title'
    })
  }

  creating() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: this.answers.title }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('src'),
      this.destinationPath('src')
    );
    this.npmInstall([
      "webpack",
      "webpack-cli",
      "webpack-dev-server",
      "babel-loader",
      "@babel/core",
      "@babel/preset-env",
      "@babel/plugin-transform-react-jsx",
      "mocha",
      "nyc",
      "@istanbuljs/nyc-config-babel",
      "babel-plugin-istanbul",
      "css",
      "html-webpack-plugin"
    ], { 'save-dev': true });
  }
};
