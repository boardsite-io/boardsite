export const readFileAsUint8Array = async (file: File): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            if (fileReader.readyState === FileReader.DONE) {
                resolve(new Uint8Array(fileReader.result as ArrayBuffer))
            }
        }
        fileReader.onerror = (err) => {
            reject(err)
        }
        fileReader.readAsArrayBuffer(file)
    })
