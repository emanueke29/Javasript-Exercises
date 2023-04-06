function Promise_all(promises) {
//     return new Promise((resolve, reject) => {
//       let results = [];
//       let pending = promises.length;
//       for (let i = 0; i < promises.length; i++) {
//         promises[i].then(result => {
//           results[i] = result;
//           pending--;
//           if (pending == 0) resolve(results);
//         }).catch(reject);
//       }
//       if (promises.length == 0) resolve(results);
//     });
//   }