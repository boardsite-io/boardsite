import { IntlMessageId } from "language"
import { loading } from "state/loading"

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

export const startBackgroundJob = async <T>(
    userMessage: IntlMessageId,
    job: () => Promise<T>
) => {
    loading.startLoading(userMessage)
    return new Promise((resolve, reject) => {
        // For some reason the loading dialog doesnt show if the pdf render
        // isnt delayed a little. Probably the state updates are combined and
        // then the pdf render blocks any updates until its finished.
        setTimeout(async () => {
            try {
                const value = await job()
                resolve(value)
            } catch (err) {
                reject(err)
            }
            loading.endLoading()
        }, 50)
    })
}
