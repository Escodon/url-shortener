async function find(slug, DB) {
	let resFromDB = await DB.prepare("SELECT * FROM links WHERE slug = '"+slug+"'").get(slug);
	await DB.prepare("UPDATE links SET count = count + 1 WHERE slug = '"+slug+"'").run();
	return resFromDB; //array i think
  }

async function handleRequest(url, DB) {
	if (url.includes("favicon.ico")) {
		return (null, { status: 404 });
	}
	if (url.includes("/new")) {
		let newUrl = url.split("?url=")[1];
		let newUrlSlug = url.split("?slug=")[1];
		await find(newUrlSlug, newUrl, DB)[2] //Array = Slug: Link: Count
		return ("OK", { status: 200 });
	} else {
		let slug = url.split("/")[1];

		//let newUrl = await Links.get(slug);
		if (newUrl) {
			await Count.put(slug, 1);
			return new Response(newUrl, {
				status: 301,
				headers: { Location: newUrl },
			});
		} else {
			return new Response("Not found", { status: 404 });
		}
	}

	
}


export default {
	async fetch(request, env, ctx) {
		let url = request.url;
		let DB = env.DB

		//DB Consts
		

		return new Response(handleRequest(url, DB));
	},
};
