const mjml = require('mjml');
const { Client } = require('../../models');

const getMailHeaders = async () => {
  const client = await Client.findOne({ where: { id: 1 } });
  return `
    <mj-section background-color="#f0f0f0">
      <mj-column>
        <mj-text align="center"
                 font-style="italic"
                 font-size="20px"
                 color="#626262">
          ${client ? client.dataValues.name : 'Your Company'}
        </mj-text>
      </mj-column>
    </mj-section>
  `;
};

const mailFooter = `
<mj-section background-color="#e7e7e7">
  <mj-column>
    <mj-social>
      <mj-social-element name="facebook">Share</mj-social-element>
    </mj-social>
  </mj-column>
</mj-section>
`;

const resetLinkTemplate = async (link, user) => {
  const mailHeaders = await getMailHeaders(); // Fetch dynamically

  return mjml(`
<mjml>
  <mj-body>
    ${mailHeaders}
    <mj-section>
      <mj-column>
        <mj-text>
          Hi ${user.first_name || 'there'},
        </mj-text>
        <mj-text>
          We received a request to reset your password. No worries—we’ve got you covered!
          Click the button below to securely reset your password:
        </mj-text>
        <mj-button background-color="#F45E43" align="left" href="${link}">
          Reset Password
        </mj-button>
         <mj-text>
        If you didn’t request this change, you can safely ignore this email. Your password will remain the same.
        For security reasons, this link will expire in 1 hour.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-divider />
        <mj-text>
          Or copy the link below:
        </mj-text>
        <mj-text>${link}</mj-text>
       
      </mj-column>
    </mj-section>
    ${mailFooter}
  </mj-body>
</mjml>
`).html; // Convert final template to HTML
};

module.exports = {
  resetLinkTemplate,
};
