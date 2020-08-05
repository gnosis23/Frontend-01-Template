const select = require('./index');

void async function() {
  console.log('which framework do you want to use?');
  const selected = await select(["vue", "react", "angular"]);
  console.log('You selected ' + selected + '');
}();
