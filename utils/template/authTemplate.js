const mailHeaders = "";
const mailFooter = "";

const resetLinkTempale = (link) => {
  return `<div>Click the link below to reset your password</div><br/> 
         <a href="${link}">Reset Link</a>
         <hr/>
         or copy the link below
         ${link}
    `;
};

module.exports = {
  resetLinkTempale,
};
