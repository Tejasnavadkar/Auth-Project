// import { Button } from 'flowbite-react'
// import React from 'react'
// import { SiFusionauth } from 'react-icons/si'

// const VerifyOtp = () => {

    
// // use this simple function to automatically focus on the next input
// function focusNextInput(el, prevId, nextId) {
//     if (el.value.length === 0) {
//         if (prevId) {
//             document.getElementById(prevId).focus();
//         }
//     } else {
//         if (nextId) {
//             document.getElementById(nextId).focus();
//         }
//     }
// }

// document.querySelectorAll('[data-focus-input-init]').forEach(function(element) {
//     element.addEventListener('keyup', function() {
//         const prevId = this.getAttribute('data-focus-input-prev');
//         const nextId = this.getAttribute('data-focus-input-next');
//         focusNextInput(this, prevId, nextId);
//     });
    
// // Handle paste event to split the pasted code into each input
//     element.addEventListener('paste', function(event) {
//         event.preventDefault();
//         const pasteData = (event.clipboardData || window.clipboardData).getData('text');
//         const digits = pasteData.replace(/\D/g, ''); // Only take numbers from the pasted data

//         // Get all input fields
//         const inputs = document.querySelectorAll('[data-focus-input-init]');
        
//         // Iterate over the inputs and assign values from the pasted string
//         inputs.forEach((input, index) => {
//             if (digits[index]) {
//                 input.value = digits[index];
//                 // Focus the next input after filling the current one
//                 const nextId = input.getAttribute('data-focus-input-next');
//                 if (nextId) {
//                     document.getElementById(nextId).focus();
//                 }
//             }
//         });
//     });
// });

    
//     return (
//         <div>
//             <div className="flex flex-col items-center gap-4">
//                 <SiFusionauth className="text-5xl" />
//                 <h1 className="text-2xl font-bold mb-10">Verify Email By OTP</h1>
//             </div>

//             <form className="max-w-sm mx-auto">
//                 <div className="flex justify-center mb-2 space-x-2 rtl:space-x-reverse">
//                     {/* {
//                         [...Array(6)].map((_, idx) => {

//                             return <div >
//                                 <label htmlFor={`code-${idx + 1}`} className="sr-only">
//                                     {`code-${idx + 1}`}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     maxLength={1}
//                                      data-focus-input-prev={`code-${idx - 1}`}
//                                     data-focus-input-init
//                                     data-focus-input-next={`code-${idx + 1}`}
//                                     id={`code-${idx + 1}`}
//                                     className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//                                     required
//                                 />
//                             </div>
//                         })
             
//              } */}


// <div>
//             <label htmlFor="code-1" className="sr-only">First code</label>
//             <input type="text" maxlength="1" data-focus-input-init data-focus-input-next="code-2" id="code-1" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
//         </div>
//         <div>
//             <label htmlFor="code-2" className="sr-only">Second code</label>
//             <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-1" data-focus-input-next="code-3" id="code-2" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
//         </div>
//         <div>
//             <label htmlFor="code-3" className="sr-only">Third code</label>
//             <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-2" data-focus-input-next="code-4" id="code-3" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
//         </div>
//         <div>
//             <label htmlFor="code-4" className="sr-only">Fourth code</label>
//             <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-3" data-focus-input-next="code-5" id="code-4" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
//         </div>
//         <div>
//             <label htmlFor="code-5" className="sr-only">Fifth code</label>
//             <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-4" data-focus-input-next="code-6" id="code-5" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
//         </div>
       
             



//                 </div>
//                 <div className="block mt-6 mb-4">
//                     <Button type="submit" className="w-48 mx-auto">
//                         Verify Email OTP
//                     </Button>
//                 </div>
//                 <p
//                     id="helper-text-explanation"
//                     className="mt-2 text-sm text-gray-500 dark:text-gray-400"
//                 >
//                     Please introduce the 6 digit code we sent via email.
//                 </p>
//             </form>
//         </div>
//     )
// }

// export default VerifyOtp



import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { SiFusionauth } from 'react-icons/si'

const VerifyOtp = () => {

   const otpLength:number = 6

    useEffect(() => {
        console.log('this',this)
        const focusNextInput = (el, prevId, nextId) => {
            // console.log('this',el) active input box element element 
            console.log('prevId',prevId)
            console.log('nextId',nextId)
            console.log('el.value.length--',el.value.length)
            if (el.value.length === 0) {  
                if (prevId) {                   // here agar input field blanck o jaye and uske pichle wala element hai to focus on previous element
                        
                    const prevElement = document.getElementById(prevId);
                    if (prevElement) {
                        prevElement.focus();
                    }
                    
                }
            } else {
                if (nextId) {
                    const nextElement = document.getElementById(nextId)

                    if(nextElement){
                        nextElement.focus()
                    }
                }
            }
        }

        document.querySelectorAll('[data-focus-input-init]').forEach(function(element) {
            element.addEventListener('keyup', function() {    // inside eventlistener this gives elemen on which we add listener
                const prevId = this.getAttribute('data-focus-input-prev');
                const nextId = this.getAttribute('data-focus-input-next');
                
                focusNextInput(this, prevId, nextId);
            });
            
            // Handle paste event to split the pasted code into each input
            element.addEventListener('paste', function(event) {
                event.preventDefault();
                const pasteData = (event.clipboardData || window.clipboardData).getData('text');
                const digits = pasteData.replace(/\D/g, ''); // Only take numbers from the pasted data

                // Get all input fields
                const inputs = document.querySelectorAll('[data-focus-input-init]');
                
                // Iterate over the inputs and assign values from the pasted string
                inputs.forEach((input, index) => {
                    if (digits[index]) {
                        input.value = digits[index];
                        // Focus the next input after filling the current one
                        const nextId = input.getAttribute('data-focus-input-next');
                        if (nextId) {
                            document.getElementById(nextId).focus();
                        }
                    }
                });
            });
        });
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center gap-4">
                <SiFusionauth className="text-5xl" />
                <h1 className="text-2xl font-bold mb-10">Verify Email By OTP</h1>
            </div>

            <form className="max-w-sm mx-auto">
                <div className="flex justify-center mb-2 space-x-2 rtl:space-x-reverse">
                    {[...Array(otpLength)].map((_, idx) => (
                        <div key={idx}>
                            <label htmlFor={`code-${idx + 1}`} className="sr-only">
                                {`code-${idx + 1}`}
                            </label>
                            <input
                                type="text"
                                maxLength={1}
                                data-focus-input-prev={idx > 0 ? `code-${idx}` : null}
                                data-focus-input-init
                                data-focus-input-next={idx < otpLength-1 ? `code-${idx + 2}` : null}
                                id={`code-${idx + 1}`}
                                className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                required
                            />
                        </div>
                    ))}
                </div>
                <div className="block mt-6 mb-4">
                    <Button type="submit" className="w-48 mx-auto">
                        Verify Email OTP
                    </Button>
                </div>
                <p
                    id="helper-text-explanation"
                    className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                    Please introduce the 6 digit code we sent via email.
                </p>
            </form>
        </div>
    )
}

export default VerifyOtp
