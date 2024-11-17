import * as db from '$lib/tictactoe';

export function load({ fetch,params,setHeaders,cookies,url }) {
	//let search = url.searchParams;
	//let item= decodeURIComponent(search.get('item')||"");
    return(db.getState());
}

export const actions = {
	move: async ({ cookies, request,url }) => {
		const data = await request.formData();
        const userid = cookies.get('userid');
        let idx=parseInt(data.get('id'),10);
		let res={}, params = {}; 
        try{
            //res= await createDir(`${IMGDIR}/${dir}`); 
            db.setState(idx,userid);
        } catch(err) {
            throw new error(422,err.message);
        }
        return { success: true, message: JSON.stringify(res) };
	}
};