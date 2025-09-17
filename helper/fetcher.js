//  const fetcher = async (url,method,body) => {
//     const data = await fetch(url,{
//         "method": method,
//         "headers":{
//             "content-type":"Application/json",
//         },
//         "body": JSON.stringify(body)
//     });
//     if(!data?.ok){
//         console.log('error')
//         return
//     }
//     const response = await data.json();
//     return {response:response,header:data.headers.get('authorization')};
// }

// module.exports = fetcher;


// const fetch = require('node-fetch'); // If using Node.js (and not globally available)

// const fetcher = async (url, method = 'GET', body = null, customHeaders = {}) => {
//   const headers = {
//     'Content-Type': 'application/json',
//     ...customHeaders, // Spread any custom headers like Authorization
//   };

//   console.log(customHeaders, "customHeaders")

//   const options = {
//     method,
//     headers,
//   };

//   if (body && method !== 'GET') {
//     options.body = JSON.stringify(body);
//   }

//   try {
//     const data = await fetch(url, options);

//     if (!data.ok) {
//       console.log(`❌ HTTP Error ${data.status}: ${data.statusText}`);
//       return;
//     }

//     const response = await data.json();

//     return {
//       response,
//       header: data.headers.get('authorization') || null
//     };
//   } catch (err) {
//     console.error('❌ Fetcher error:', err.message);
//     return;
//   }
// };

// module.exports = fetcher;

// const fetch = require('node-fetch');

const fetcher = async (url, method = 'GET', body = null, customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Node)',
    ...customHeaders,
  };

  const options = {
    method,
    headers
  };

  if (body && method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(body);
  }

  console.log('➡️ fetcher request:', { url, options });

  try {
    const response = await fetch(url, options);
    console.log(response,"Sda")
    console.log('⬅️ fetcher response status:', response.status);
    const respText = await response.text();
    console.log('⬅️ fetcher response body:', respText.substring(0, 500)); // limit to avoid huge

    if (!response.ok) {
      console.log(`❌ HTTP Error ${response.status}: ${response.statusText}`);
      return;
    }

    const data = JSON.parse(respText);
    return { response: data, header: response.headers.get('authorization') || null };

  } catch (err) {
    console.error('❌ Fetcher error:', err.message);
    return;
  }
};

module.exports = fetcher;
