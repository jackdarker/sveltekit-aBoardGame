import { json } from '@sveltejs/kit';
//import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
  if (locals.wss) {
    locals.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(`Hello from the GET handler at ${new Date().toLocaleString()}`);
      }
    });
  }
	return json({ success: true, message: 'Hello world from GET handler', url });
}) /*satisfies RequestHandler*/;

export const POST = (async (params) => {
    let url=params.url,_params=params.params,cookies=params.cookies,route=params.route,locals=params.locals,request=params.request;
    const data = await request.json();
	const userid = cookies.get('userid');
      return json({
          success:true,
            detail: 'Successfully logged in.',
            user: {
                username:'username'
            }
        });
  }) /*satisfies RequestHandler*/;