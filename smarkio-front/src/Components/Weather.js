import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./index.css"


const Weather = (props) => {
    const [history, setHistory] = useState(null)
    const [top5, setTop5] = useState(null)
    const [city, setCity] = useState(null)
    const [options, setOptions] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(false)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const update = () => {
        axios.get(`http://localhost:5000/history/full`).then(res => {
            setHistory(res.data)
        })
        axios.get(`http://localhost:5000/history/top`).then(res => {
            setTop5(res.data)
        })
        setLoading(false)
    }
    useEffect(() => {
        update()

        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=itajuba&appid=45531523c597eec615d42e3a9158bbe1`).then(res => {
            console.log(city)
            setCity(res)
        })
        setLoading(false)
        setErr(false)
    }, [])
    return (
        < div style={{ fontFamily: 'sans-serif', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5%', marginBottom: '2.5%' }}>
                <input onInput={(event => setOptions(event.target.value))} type="text" style={{ width: '350px', border: '1px solid #000000' }} /> <button onClick={(e) => {
                    let option = options

                    console.log(option)

                    setLoading(true)

                        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${option.replace(" ", "+")}&appid=45531523c597eec615d42e3a9158bbe1`).then(res => {
                            setCity(res)
                            axios.post(`http://localhost:5000/history`, {
                                "city_name": `${res.data.name}`
                            }).then(res => {
                                setErr(false)
                                update()
                            })
                        }).catch(err => {
                            console.log("err",err)
                            setErr(true)
                        })

                }}
                    style={{ border: '1px solid #000000', backgroundColor: 'white', color: 'black' }}>Search</button></div>
            {!loading && city !==null && !err ? 
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>

                    <div style={{ display: 'flex', justifyContent: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0' }}>{new Date().getHours()}:{new Date().getMinutes()}, {monthNames[new Date().getMonth()]} {new Date().getDay()}</h3>
                            <h2 style={{ margin: '0', alignSelf: 'flex-end' }}>{city.data.name}, {city.data.sys.country}</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', margin: '0' }}>
                            <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                                {<img src={`http://openweathermap.org/img/wn/${city.data.weather[0].icon}@2x.png`} />}
                                <a style={{ fontSize: '3.2rem' }}>{Math.round(city.data.main.temp - 273)}ºC</a>
                            </div>

                            <a>Feels like {Math.round(city.data.main.feels_like - 273)}ºC. {city.data.weather[0].description}</a>
                        </div>

                    </div>


                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginLeft: '5%' }}>
                        <div style={{ marginBottom: '10%' }}>
                            <a>Top 5</a>

                            <ol style={{ marginTop: '10px', padding: '0', listStyle: 'none', }}>{top5 && top5.map((e, i) => <li key={i}>{e.city_name}</li>)}</ol>
                        </div>
                        <div style={{ overflow: 'auto', maxHeight: '700px' }}>
                            <a>History</a>
                            <ul style={{ marginTop: '10px', padding: '0', listStyle: 'none' }}>{history && history.map((e, i) => <li key={i}>{e.city_name}</li>)}</ul>
                        </div>

                    </div>

                </div>
                : loading && !err ?  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}><h1>loading ...</h1></div>  : <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}><h1>City not found</h1></div>
                
                }
        </div >)
}

export default Weather
