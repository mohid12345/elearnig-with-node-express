const creatorCollection = require("../../models/creatorSchema");

module.exports.getCreatorDash = async (req, res) => {
   try{
    if (req.session.creator) {
      creatorData = await creatorCollection.find({});
      res.render("creatorDashboard", creatorData);
    } else {
      res.render("creatorLogin");
    }
  } catch (error) {
   console.error('error getting dashboard', error)
   res.status(500).send('internal server error')
  }
}