const fs = require('fs');
const { v1: uuid } = require('uuid');
const fakerator = require('fakerator')('fr-FR');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

(async () => {
  const events = [];
  const reactions = [];
  const eventEnum = ['view', 'click', 'share'];
  const reactionEnum = ['like', 'heart', 'sad', 'crossfinger', 'applause'];

  const posts = JSON.parse(await fs.readFileSync(__dirname + '/posts.json'));
  const users = [];
  for (let i = 0; i < (posts.length - 1) * 5; i++) {
    users.push(`${uuid()}|${fakerator.names.name()}`);
  }
  for (const post of posts) {
    const nbEvent = getRandomInt((posts.length - 1) * 5);
    for (let j = 0; j < nbEvent; j++) {
      events.push({
        _id: uuid(),
        postId: post._id,
        type: eventEnum[getRandomInt(3)],
        date: new Date(),
        userId: users[j],
      });
    }

    const nbLike = getRandomInt(posts.length - 1);
    for (let l = 0; l < nbLike; l++) {
      reactions.push({
        _id: uuid(),
        postId: post._id,
        reactionType: reactionEnum[getRandomInt(5)],
        date: new Date(),
        userId: users[l],
      });
    }
  }

  console.log('events', events.length);
  console.log('reactions', reactions.length);


  await fs.writeFileSync(__dirname + '/events.json', JSON.stringify(events));
  await fs.writeFileSync(
    __dirname + '/reactions.json',
    JSON.stringify(reactions),
  );
})();
