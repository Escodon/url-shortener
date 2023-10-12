async function handleRequest(url, Links, Count) {
	if (url.includes("favicon.ico")) {
		return (null, { status: 404 });
	}
	if (url.includes("/new")) {
		let newUrl = url.split("?url=")[1];
		let newUrlSlug = url.split("?slug=")[1];
		await Links.put(newUrlSlug, newUrl);
		return ("OK", { status: 200 });
	} else {
		let slug = url.split("/")[1];
		let newUrl = await Links.get(slug);
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
		let Links = env.Links;
		let Count = env.Count;
		return new Response(handleRequest(url, Links, Count));
	},
};
