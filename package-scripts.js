module.exports = {
  scripts: {
    serve: 'vue-cli-service serve',
    build: 'vue-cli-service build',
    lint: 'vue-cli-service lint',
    start: 'cd ./server/ && npm start',
    install_client: 'yarn install',
    install_server: 'cd ./server/ && npm install && cd ..'
  }
};
