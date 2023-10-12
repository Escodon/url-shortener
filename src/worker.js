async function find(slug, DB) {
	console.log('Finding entry for: ', slug);
	let resFromDB = await DB.prepare("SELECT * FROM links WHERE slug = '"+slug+"'").get(); //get the whole row as an array. [slug, link, count]
	if (resFromDB) {
	  await DB.prepare("UPDATE links SET count = count + 1 WHERE slug = '"+slug+"'").run(); //add one to the slug count
	  console.log("Found!");
	  return [resFromDB.slug, resFromDB.link, resFromDB.count]; //return an array of values
	} else {
	  console.log("Not found!");
	  return null; //return null if no row is found
	}
  }
  
  async function handleRequest(url, DB) {
	console.log('Handling request for:', url);
	if (url == "") {
		return ("Please enter a URL", { status: 200 });
	}
	if (url.includes("favicon.ico")) {
	  console.log('favicon.ico requested');
	  return (null, { status: 404 });
	} else {
	  console.log('Slug requested:', url + ". Checking DB...");
		
	  let row = await find(url, DB);
	  console.log('Row found:', row);
	  if (row) {
		let newUrl = row[1];
		console.log('Redirecting to:', newUrl);
		return (newUrl, {
		  status: 301,
		  headers: { Location: newUrl },
		});
	  } else {
		console.log('Slug not found');
		return ("Not found", { status: 404 });
	  }
	}
  }


export default {
	async fetch(request, env, ctx) {
		var url = request.url;
		var url = url.split("/")[3]
		let DB = env.D1;
		return new Response(await handleRequest(url, DB));
	},
};
