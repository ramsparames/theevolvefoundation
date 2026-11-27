
const {
  json,
  parseBody,
  normalizeEmail
}=require("./_lib");

function escapeHtml(value){
  return String(value||"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function cleanList(values,max=3){
  return Array.isArray(values)
    ? values
        .map(value=>String(value||"").trim())
        .filter(Boolean)
        .slice(0,max)
    : [];
}

module.exports=async(req,res)=>{

  if(req.method!=="POST"){
    return json(
      res,
      405,
      {
        ok:false,
        message:"Method not allowed."
      }
    );
  }

  try{

    const body=
      await parseBody(req);

    const parentEmail=
      normalizeEmail(
        body.parentEmail
      );

    const studentName=
      String(
        body.studentName||""
      )
      .trim()
      .slice(0,120);

    const studentEmail=
      normalizeEmail(
        body.studentEmail
      );

    const course=
      String(
        body.course||""
      )
      .trim()
      .slice(0,160);

    const colleges=
      cleanList(
        body.colleges,
        3
      );

    const summaryText=
      String(
        body.summaryText||""
      )
      .trim()
      .slice(0,10000);

    if(
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        parentEmail
      )
    ){
      return json(
        res,
        400,
        {
          ok:false,
          message:"Please enter a valid parent email address."
        }
      );
    }

    if(!summaryText){
      return json(
        res,
        400,
        {
          ok:false,
          message:"The Compass snapshot is empty."
        }
      );
    }

    if(
      studentEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        studentEmail
      )
    ){
      return json(
        res,
        400,
        {
          ok:false,
          message:"The student email address is not valid."
        }
      );
    }

    const origin=
      process.env.APP_ORIGIN ||
      `https://${req.headers.host}`;

    const greeting=
      studentName
        ? `A Compass snapshot from ${escapeHtml(studentName)}`
        : "A Compass snapshot";

    const collegeHtml=
      colleges.length
        ? `
          <div style="margin:20px 0 0">
            <div style="font-size:11px;letter-spacing:.12em;color:#7a847f;font-weight:600">COLLEGES BEING CONSIDERED</div>
            <div style="margin-top:8px">
              ${colleges.map((college,index)=>`
                <span style="display:inline-block;margin:0 6px 6px 0;padding:7px 10px;background:#eef1ed;border:1px solid #dfe4e0;color:#17201d;font-size:13px">
                  ${index+1}. ${escapeHtml(college)}
                </span>
              `).join("")}
            </div>
          </div>
        `
        : "";

    const courseHtml=
      course
        ? `
          <div style="margin-top:20px">
            <div style="font-size:11px;letter-spacing:.12em;color:#7a847f;font-weight:600">COURSE OR DIRECTION</div>
            <div style="margin-top:5px;font-family:Georgia,serif;font-size:22px;color:#17201d">${escapeHtml(course)}</div>
          </div>
        `
        : "";

    const summaryHtml=
      escapeHtml(summaryText)
        .replace(/\n/g,"<br>");

    const html=`
      <div style="margin:0;background:#f8f8f4;padding:32px 16px;font-family:Arial,sans-serif;color:#17201d">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dfe4e0">
          <div style="padding:28px 32px;border-bottom:1px solid #dfe4e0;background:#f7f1e7">
            <div style="font-size:11px;letter-spacing:.14em;color:#66716c">THE EVOLVE FOUNDATION · COMPASS</div>
            <h1 style="margin:12px 0 0;font-family:Georgia,serif;font-size:34px;line-height:1.15;font-weight:500;color:#17201d">My Compass</h1>
            <p style="margin:8px 0 0;color:#66716c;font-size:15px;line-height:1.5">${greeting}</p>
          </div>

          <div style="padding:28px 32px">
            ${courseHtml}
            ${collegeHtml}

            <div style="margin-top:28px;padding-top:24px;border-top:1px solid #dfe4e0">
              <div style="font-size:11px;letter-spacing:.12em;color:#7a847f;font-weight:600">THE SNAPSHOT</div>
              <div style="margin-top:12px;color:#4f5b55;font-size:15px;line-height:1.7">${summaryHtml}</div>
            </div>

            <div style="margin-top:28px;padding:18px 20px;background:#e4eee7;border:1px solid #dfe4e0">
              <div style="font-size:11px;letter-spacing:.12em;color:#66716c;font-weight:600">HOW I WOULD LIKE YOU TO HELP</div>
              <p style="margin:8px 0 0;color:#4f5b55;font-size:14px;line-height:1.6">Listen to what I am thinking, help me find reliable information and ask questions without trying to make the decision for me.</p>
            </div>

            <p style="margin:24px 0 0;color:#7a847f;font-size:12px;line-height:1.6">
              This is a snapshot of my thinking today. It is not a recommendation or a final decision.
            </p>
          </div>

          <div style="padding:18px 32px;border-top:1px solid #dfe4e0;color:#8a938e;font-size:11px;line-height:1.5">
            The Evolve Foundation · Compass
            · <a href="${escapeHtml(origin)}" style="color:#66716c">Open Compass</a>
          </div>
        </div>
      </div>
    `;

    if(!process.env.RESEND_API_KEY){
      return json(
        res,
        500,
        {
          ok:false,
          message:"Email delivery is not configured yet."
        }
      );
    }

    const payload={
      from:
        process.env.MAIL_FROM ||
        "The Evolve Foundation <enquire@theevolvefoundation.com>",
      to:[parentEmail],
      subject:
        studentName
          ? `${studentName}'s Compass snapshot`
          : "A Compass snapshot",
      html
    };

    if(studentEmail){
      payload.reply_to=[studentEmail];
    }

    const response=
      await fetch(
        "https://api.resend.com/emails",
        {
          method:"POST",
          headers:{
            "Authorization":
              `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type":
              "application/json"
          },
          body:JSON.stringify(payload)
        }
      );

    if(!response.ok){
      return json(
        res,
        502,
        {
          ok:false,
          message:"We could not send the Compass snapshot. Please try again."
        }
      );
    }

    return json(
      res,
      200,
      {
        ok:true
      }
    );

  }
  catch(error){

    console.error(error);

    return json(
      res,
      500,
      {
        ok:false,
        message:
          error.message||
          "Unable to send Compass snapshot."
      }
    );

  }

};
