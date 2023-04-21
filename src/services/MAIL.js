const nodemailer = require('nodemailer');
const { MAIL_SETTINGS } = require('../constants/constants');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMailForgotPass = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: '[FindRoom.vn] Xác thực đổi mật khẩu', // Subject line
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FindRoom.vn ✔</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Cảm ơn bạn đã chọn FindRoom.vn. Sử dụng mã OTP sau để đổi mật khẩu của bạn. OTP có giá trị vĩnh viễn . Không được chia sẻ dưới mọi hình thức</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${params.OTP}</h2>
    <p style="font-size:0.9em;">Dũng,<br />FindRoom.vn</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Tòa nhà FPT Polytechnic</p>
      <p>P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm</p>
      <p>Hà Nội</p>
    </div>
  </div>
</div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};