import React, {useEffect, useState} from 'react';
import './index.scss';
import {Collection} from "./components/collection/Collection";
import axios from "axios";

const categories = [
    {"name": "Все"},
    {"name": "Море"},
    {"name": "Горы"},
    {"name": "Архитектура"},
    {"name": "Города"}
];

function App() {
    const [categoryId, setCategoryId] = useState(0)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [collection, setCollection] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        setIsLoading(true)

        const category = categoryId ? `?category=${categoryId}` : ''

        const fetchData = async () => {
            const response = await axios.get(`https://64d488ffb592423e46943878.mockapi.io/collection?page=${page}&limit=3&${category}`)
            setCollection(response.data)
            return setIsLoading(false)
        }

        fetchData()
    }, [categoryId,page])

    const onChangeInput = (e) => setSearch(e.target.value)

    return (
        <div className="App">
            <h1>Моя коллекция фотографий</h1>
            <div className="top">
                <ul className="tags">
                    {categories.map((category, idx) => (
                        <li
                            className={categoryId === idx ? 'active' : ''}
                            key={category.name}
                            onClick={() => setCategoryId(idx)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
                <input value={search} onChange={onChangeInput} className="search-input"
                       placeholder="Поиск по названию"/>
            </div>
            <div className="content">
                {isLoading ?
                    <h2>Идёт загрузка...</h2>
                    :
                    collection
                        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
                        .map((item, idx, array) => (
                            <Collection
                                key={idx}
                                name={item.name}
                                images={item['photos']}
                            />
                        ))}

            </div>
            <ul className="pagination">
                {
                    [...Array(3)].map((_, idx) =>
                        <li
                            key={idx}
                            onClick={() => setPage(idx + 1)}
                            className={page === (idx + 1) ? 'active' : ''}
                        >
                            {idx + 1}
                        </li>)
                }
            </ul>
        </div>
    );
}

export default App;
