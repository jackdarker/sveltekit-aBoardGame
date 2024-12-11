import {redirect} from '@sveltejs/kit';
import * as db from '$lib/tictactoe';

export const load = async (event) => {//function load({ fetch,params,setHeaders,cookies,url }) {
	const id = event.cookies.get('userid');
	if (!id) {
		event.cookies.set('userid', crypto.randomUUID(), { path: '/' });
	}
	//let search = url.searchParams;
	//let item= decodeURIComponent(search.get('item')||"");
    return { user: event.locals.user };
}

/*export const actions = {
	create: async ({ cookies, request,url }) => {
		const data = await request.formData();
        const userid = cookies.get('userid');
        db.init({userid:userid});
		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}
        redirect(302, "/tictactoe");
		return { success: true,redirect:"tictactoe" };
	}
};*/