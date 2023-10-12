async function handleRequest(url, KV) {
  console.log("Handling request for:", url);
  if (url == "") {
    return "Please enter a URL", { status: 200 };
  }
  if (url.includes("favicon.ico")) {
    console.log("favicon.ico requested");
    return null, { status: 404 };
  } else {
    console.log("Slug requested:", url + ". Checking DB...");
	let newUrl = await KV.get(url);
	if (newUrl == null) {
		console.log("Slug not found in DB. Returning 404");
		return "Slug not found", { status: 404 };
	}
	console.log("Slug found in DB("+newUrl+"). Returning 301");    
      return (
        newUrl,
        {
          status: 301,
          headers: { Location: newUrl },
        }
      );
  }
}

export default {
  async fetch(request, env, ctx) {
    var url = request.url;
    var url = url.split("/")[3];
    let KV = env.KV
    return new Response(await handleRequest(url, KV));
  },
};
