const params=new URLSearchParams(location.search);
const token=params.get("token");
const title=document.getElementById("title");
const message=document.getElementById("message");
const link=document.getElementById("continue");

(async()=>{

  if(!token){

    title.textContent="This link is incomplete.";

    message.textContent=
      "Please use the latest Compass link we sent you.";

    return;

  }

  try{

    const r=await fetch(
      "../api/compass/verify?token="+encodeURIComponent(token),
      {credentials:"include"}
    );

    const data=await r.json();

    if(!r.ok||!data.ok){

      throw new Error(
        data.message||
        "This link is no longer valid."
      );

    }

    const restored={
      ...(data.answers||{})
    };

    const restoredIndex=
      Number(restored.__compass_index||0);

    delete restored.__compass_index;

    localStorage.setItem(
      "evolveCompassSlice1",
      JSON.stringify(restored)
    );

    localStorage.setItem(
      "evolveCompassSlice1Index",
      String(Math.max(0,restoredIndex))
    );

    title.textContent="Your Compass is ready.";

    message.textContent=
      "We saved your progress. You can continue from where you left off.";

    link.classList.remove("hidden");

  }
  catch(err){

    title.textContent=
      "We could not continue your Compass.";

    message.textContent=
      err.message||
      "Please request a new link from the Compass start page.";

  }

})();