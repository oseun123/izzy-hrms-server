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

const getMailFooter = async () => {
  const client = await Client.findOne({ where: { id: 1 } });
  const currentYear = new Date().getFullYear();
  return `
<mj-section background-color="#e7e7e7" padding="20px 0">
  <mj-column>
    <mj-text align="center" font-size="14px" color="#555555">
      Copyright © ${currentYear} ${
    client ? client.dataValues.name : 'Your Company'
  }. All rights reserved.
    </mj-text>
  </mj-column>
</mj-section>
`;
};

const resetLinkTemplate = async (link, user) => {
  const mailHeaders = await getMailHeaders(); // Fetch dynamically
  const mailFooter = await getMailFooter(); // Fetch dynamically

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

const employeeSetupTemplate = async (link, user) => {
  const mailHeaders = await getMailHeaders(); // Fetch dynamically
  const mailFooter = await getMailFooter(); // Fetch dynamically

  return mjml(`
<mjml>
  <mj-body>
    ${mailHeaders}
    <mj-section>
      <mj-column>
        <mj-text>
          Hello ${user.first_name || 'Employee'},
        </mj-text>
        <mj-text>
          Welcome aboard! To complete your employee account setup, please click the button below:
        </mj-text>
        <mj-button background-color="#0A84FF" align="left" href="${link}">
          Set Up Your Account
        </mj-button>
        <mj-text>
          This setup link is valid for a limited time. If you did not expect this email, you may ignore it.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-divider />
        <mj-text>
          Or copy and paste this link into your browser:
        </mj-text>
        <mj-text>${link}</mj-text>
      </mj-column>
    </mj-section>
    ${mailFooter}
  </mj-body>
</mjml>
`).html;
};

module.exports = {
  resetLinkTemplate,
  employeeSetupTemplate,
};
