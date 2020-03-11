function negotiateContent(req, res, next){
  const viewId = '';
  const htmlOpts = {};
  const jsonOpts = {};
  res.format({
    html() {
      res.render(viewId, htmlOpts);
    },

    json() {
      res.send(jsonOpts);
    },
  });
}

module.exports = negotiateContent;