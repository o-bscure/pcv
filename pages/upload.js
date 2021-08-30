import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import { find_bad_tanks } from '../lib/badTanks.js'

export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            run: "",
            files: {},
            bad_tanks: [],
        }

        this.handleRunSelect = this.handleRunSelect.bind(this);
        this.handleTankSelect = this.handleTankSelect.bind(this)
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.setTankNumbers = this.setTankNumbers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    setTankNumbers(e) {
        e.preventDefault()
        const file_keys = Object.keys(this.state.files)
        for (let i=0; i<file_keys.length; i++) {
            this.setState(prevState => ({
                ...prevState,
                files: {
                    ...prevState.files,
                    [file_keys[i]]: {
                        ...prevState.files[file_keys[i]],
                        tank: String(i+1)
                    }
                },
                bad_tanks: []
            }))
        }
    }

    handleTankSelect(event, filenumber) {
        event.preventDefault()
        var bad_tanks = find_bad_tanks(this.state.files, filenumber, event.target.value) 
        this.setState(prevState => ({
            ...prevState,
            files: {
                ...prevState.files,
                [filenumber]: {
                    ...prevState.files[filenumber],
                    tank: event.target.value
                }
            },
            bad_tanks: bad_tanks
        }))
    }

    handleRunSelect(event) {
        event.preventDefault()
        this.setState(prevState => ({
            run: event.target.value 
        }))
    }

    handleFileSelect(event, filenumber) {
        event.preventDefault()
        const f = event.target.files[0]
        this.setState(prevState => ({
            ...prevState,
            files: {
                ...prevState.files,
                [filenumber]: { 
                    ...prevState.files[filenumber],
                    img: f,
                }
            }
        }))
    }

    async handleSubmit(event) { 
        event.preventDefault()
        const file_keys = Object.keys(this.state.files)
        for (let i=0; i<file_keys.length; i++) {
            var formData = new FormData();
            let current_file = this.state.files[file_keys[i]];
            formData.append("file", current_file.img)

            await axios({
                method: 'post',
                url: `/api/upload/${this.state.run}/${current_file.tank}`,
                timeout: 5000,
                data: formData,
            })
            .then((response) => {
                this.setState(prevState => ({
                        ...prevState,
                        files: {
                            ...prevState.files,
                            [file_keys[i]]: { 
                                ...prevState.files[file_keys[i]],
                                getResults: true,
                            }
                        }
                    }))
            })
            .catch(e => {
                console.error(e.message)
            })

                //api middleware 1. saves file locally 2. runs imaging script 3. saves data in mysql
            //set state of filekey to getResults = true
            //gets data from database api in render
        }
    }

    render() {
        console.log(this.state)
        var file_keys = Object.keys(this.state.files)

        if ((this.state.bad_tanks.length > 0) || (this.state.run == "") || (Object.keys(this.state.files).length == 0) || (
            Object.keys(this.state.files).reduce((hasTank, fileKey) => {
                return (hasTank || (typeof this.state.files[fileKey].tank == "undefined"))
            }, false)
        )) {
            var submitButton=<button onClick={(e) => this.handleSubmit(e)} disabled className="flex flex-initial place-self-center bg-gray-400 m-3 p-6 rounded-t-md 
                        border-4 border-red-500 cursor-not-allowed hover:ring hover:ring-gray-300 active:bg-indigo-300">Submit</button>
        } else {
            var submitButton=<button onClick={(e) => this.handleSubmit(e)} className="flex flex-initial place-self-center bg-gray-400 m-3 p-6 rounded-t-md 
                        border-4 border-green-500 hover:ring hover:ring-gray-300 active:bg-indigo-300">Submit</button>
        }

        var filerows = [];
        for (let i=0; i<file_keys.length+1; i++) {
            filerows.push(<input type="file" key={i} accept="image/*" onChange={(e) => this.handleFileSelect(e, i)} className="flex flex-initial h-10 "/>)
        }

        var tankrows = []
        for (let i=0; i<file_keys.length; i++) {
            var box_type = "flex flex-initial place-self-center w-10 h-7 bg-gray-200 border-2 rounded-md focus:outline-none ";
            if (typeof this.state.files[i].tank != "undefined" && this.state.bad_tanks.includes(this.state.files[i].tank)) {
                box_type = box_type.concat("border-red-600")
            } else {
                box_type = box_type.concat("border-gray-100")
            }
            tankrows.push(
                <div key={i} className="flex flex-rows-1 h-10 place-content-center">
                    <label className="flex flex-initial place-items-center">Tank No. </label>
                    <input type="number" value={this.state.files[i].tank} onChange={(e) => this.handleTankSelect(e, i)} className={box_type}/>
                </div>
            )
        }

        var resultrows = []
        for (let i=0; i<file_keys.length; i++) {
            if (this.state.files[file_keys[i]].getResults == true) {
                //SWR for the given run&tank pcv reader result. here -> api -> mysql
                /*
                { data, error } useSWR('/api/???', fetcher)
                if (error) resultrows.push(<div>failed</div>)
                else if (!data) resultrows.push(<div>loading...</div>)
                else resultrows.push(<div>{data}</div>)
                */
                resultrows.push(<p key={i} className="flex flex-initial place-self-center h-10 ">chang</p>)
            } else {
                resultrows.push(<p key={i} className="flex flex-initial place-self-center h-10 ">n/a</p>)
            }
        }

        let imgs = Object.keys(this.state.files).map((imgkey) => <img key={imgkey} src={this.state.files[imgkey].img} />)
        /* console.log(imgs) */

        return (
          <div className="grid grid-cols-1 w-screen h-screen bg-gray-200">
            <form className="grid grid-cols-3 w-full h-full">
                <div className="flex flex-col flex-nowrap gap-y-5">
                    <div className="flex flex-rows-1 place-content-center m-5 mt-8">
                        <label className="flex flex-inital text-2xl pr-4">Enter Run</label>
                        <input type="text" id="run" value={this.state.run} onChange={(e) => this.handleRunSelect(e)} 
                            className="flex flex-initial w-20 bg-gray-200 border-2 border-gray-700 rounded-lg focus:outline-none"/>
                    </div>
                    <div className="flex flex-col flex-grow gap-y-5 ">{tankrows}</div>
                    <button onClick={(e) => this.setTankNumbers(e)} className="flex flex-initial place-self-center bg-gray-400 m-3 p-6 rounded-t-md 
                        active:bg-red-600 focus:outline-none">Auto</button>
                </div>

                <div className="flex flex-col flex-nowrap gap-y-5">
                    <label className="flex flex-inital m-5 mt-8 place-self-center text-2xl">Select PCV image</label>
                    <div className="flex flex-col flex-grow gap-y-5 ">{filerows}</div>
                    {submitButton}
                </div>

                <div className="flex flex-col flex-nowrap gap-y-5">
                    <label className="flex flex-inital m-5 mt-8 place-self-center text-2xl">Results</label>
                    <div className="flex flex-col flex-grow gap-y-5 ">{resultrows}</div>
                    <Link href="/"><div className="flex flex-initial place-self-center bg-gray-400 m-3 p-6 rounded-t-md cursor-pointer
                        active:bg-red-600 focus:outline-none">Back</div></Link>
                </div>
            </form>
          </div>
        )}
}