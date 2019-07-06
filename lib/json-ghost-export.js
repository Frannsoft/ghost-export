const dateFormat = require('dateformat'),
  fs = require('fs');
path = require('path');

module.exports = function(args, callback) {
  callback = callback || function() {};
  if (args.published === undefined) {
    args.published = true;
  }

  if (!args.source) {
    callback(new Error('No source Ghost export file specified'), 0);
  } else if (!fs.existsSync(args.source)) {
    callback(new Error(`Specified Ghost export file '${args.source}' does not exist`), 0);
  } else if (!args.destination) {
    callback(new Error('No destination directory specified'), 0);
  } else {
    if (!fs.existsSync(args.destination)) {
      fs.mkdirSync(args.destination);
    }

    if (args.published) {
      const rawGhostData = fs.readFileSync(args.source);
      const ghostData = JSON.parse(rawGhostData);

      const posts = ghostData.db[0].data.posts;
      posts
        .filter(post => post.status === args.published ? 'published' : true)
        .map(post => {
          const mobiledoc = JSON.parse(post.mobiledoc);
          const markdown = mobiledoc.cards[0][1]['markdown'];
          const exportedData = {
            title: post.title,
            publishDate: post.published_at,
            description: post.meta_description,
            markdownbody: markdown
          };

          const date = exportedData.publishDate ? `date: "${dateFormat(new Date(exportedData.publishDate), 'yyyy-mm-dd')}"` : '';
          const description = exportedData.description ? `description: ${exportedData.description}\n` : '';

          const contents = `---\ntitle: ${exportedData.title}\n${date}\n${description}---\n\n${
            exportedData.markdownbody
          }`;

          const outfile = `${args.destination}/${post.slug}.md`;
          fs.writeFileSync(outfile, contents);
        });
    }
  }
};
