module.exports = {
  "POST /api/demo": (req, res) => {
    setTimeout(() => {
      res.json({
        code: 0,
        data: {
          isRight: true
        },
        msg: "嘿嘿"
      })
    }, 300)
  },

};
