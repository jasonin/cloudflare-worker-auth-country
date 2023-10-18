/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const jwt = request.headers.get('cf-access-jwt-assertion');
		if (!jwt) {
			return new Response('Unauthorized', { status: 401 });
		}

		// Split the JWT into its parts
		const jwtParts = jwt.split('.');
		const headerBase64Url = jwtParts[0];
		const payloadBase64Url = jwtParts[1];

		// Base64Url decode the payload
		const payloadBase64 = payloadBase64Url.replace('-', '+').replace('_', '/');
		const payloadString = atob(payloadBase64);
		const payload = JSON.parse(payloadString);
		
		const email = payload.email;
  	const country = payload.country;

		const timestamp = payload.iat || payload.auth_time;
		const date = new Date(timestamp * 1000).toISOString(); // Convert from seconds to milliseconds
	
		// Crafting the response
		let responseHtml = `<p>${email} authenticated at ${date} from <a href="/secure/${country}">${country}</a></p>`;

		return new Response(responseHtml, {
			headers: { 'Content-Type': 'text/html' }
		});	
	},
};
