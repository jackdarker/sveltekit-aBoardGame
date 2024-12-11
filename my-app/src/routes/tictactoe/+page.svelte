<script lang="ts">
	import type { PageData } from './$types';
    import { goto,invalidateAll } from '$app/navigation';
    import { Button, Tag,Form, TextInput, Search, Select, SelectItem } from "carbon-components-svelte";
    import { onMount } from 'svelte';

    import { source } from 'sveltekit-sse'
    const value = source('/custom-event').select('message')

    let webSocketEstablished = false;
    let ws  = null;
    let log = $state([]);
  
    const logEvent = (str) => {
      log = [...log, str].slice(-5);
    };
  
    const establishWebSocket = () => {
      if (webSocketEstablished) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${window.location.host}/websocket`,'lobby');
      ws.addEventListener('open', event => {
        webSocketEstablished = true;
        console.log('[websocket] connection open', event);
        logEvent('[websocket] connection open');
      });
      ws.addEventListener('close', event => {
        console.log('[websocket] connection closed', event);
        logEvent('[websocket] connection closed');
      });
      ws.addEventListener('message', event => {
        console.log('[websocket] message received', event);
        logEvent(`[websocket] message received: ${event.data}`);
        //goto(location.href, { replaceState:true,invalidateAll:true }) //does also work?
        invalidateAll();    //TODO invalidate((URL)=>{URL==="/path"});
      });
    };
  
    const requestData = async () => {
      const res = await fetch('/api/test');
      const data = await res.json();
      console.log('Data from GET endpoint', data);
      logEvent(`[GET] data received: ${JSON.stringify(data)}`);
    };

	let { data }: { data: PageData } = $props();
    let img=["O.png","_.png","X.png"];

    async function onclick(e){  
        //alert(e.currentTarget.id);
	    let formData = new FormData(document.getElementById("assignForm"));
        formData.set('id', e.currentTarget.id); //could also .append
        let idx=parseInt(e.currentTarget.id,10);
        if(data.tiles[idx]!=0){
            alert("This tile is already set !");
            e.preventDefault();
        } else {
            let url ="?/move";
            let res = await fetch(url,{
                method: 'POST',
                body: formData,
            });

            let status = await res.status
            let response = await res.json();
            console.log(status);
            if (status != 200){
                alert(response.error.message);
            } else {
                goto(location.href, { replaceState:true,invalidateAll:true })
                //location.reload(); //this causes page to flicker because full reload
            }
        }
    }
    function validateForm(e) {  //TODO this isnt called because we use form programatical
        let x = document.forms["assignForm"]["id"].value;
        if (x == "") {
            alert("Name must be filled out");
            e.preventDefault();
        }
    }
    onMount(()=>{
        establishWebSocket();
    });
    function afterReload(_data){    //refresh local data with loaded data
    }
   //$:afterReload(data);
</script>
<svelte:head>
	<meta name="description" content="tictactoe" />
</svelte:head>

<section>
<div class="text-column">
    <table style="table-layout:fixed" width="240em">
        <colgroup>
            <col style="width:25%" span="1">
            <col style="width:25%" span="1" >
            <col style="width:25%" span="1" >
        </colgroup>
        <tbody>
        <tr>
            <td scope="col"><img on:click={onclick} id="0" src={img[1+data.tiles[0]]}/></td>
            <td scope="col"><img on:click={onclick} id="1" src={img[1+data.tiles[1]]}/></td>
            <td scope="col"><img on:click={onclick} id="2" src={img[1+data.tiles[2]]}/></td>
        </tr>
        <tr>
            <td scope="col"><img on:click={onclick} id="3" src={img[1+data.tiles[3]]}/></td>
            <td scope="col"><img on:click={onclick} id="4" src={img[1+data.tiles[4]]}/></td>
            <td scope="col"><img on:click={onclick} id="5" src={img[1+data.tiles[5]]}/></td>
        </tr>
        <tr>
            <td scope="col"><img on:click={onclick} id="6" src={img[1+data.tiles[6]]}/></td>
            <td scope="col"><img on:click={onclick} id="7" src={img[1+data.tiles[7]]}/></td>
            <td scope="col"><img on:click={onclick} id="8" src={img[1+data.tiles[8]]}/></td>
        </tr>
    </tbody>
    </table>
</div>
<div>
    <div>{data.tiles}{$value}</div>
    <ul>
        {#each log as event}
          <li>{event}</li>
        {/each}
    </ul>
</div>
<Form name="assignForm" id="assignForm" method="POST" enctype="multipart/form-data" action="?/move" on:submit={(e)=>{validateForm(e)}} hidden>
    <input name="id" autocomplete="off"/>
</Form>
</section>