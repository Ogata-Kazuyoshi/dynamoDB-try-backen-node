import axios from "axios";
import { useState } from "react";

function App() {
    const [postId, setPostId] = useState("");
    const [postData, setPostData] = useState("");
    const [getId, setGetId] = useState("");

    const handleGet = async () => {
        const res = await axios.get('/api/test').then(res => res.data);
        console.log({ res });
    };

    const handleCreateTable = async () => {
        const res = await axios.post('/api/test/create-table').then(res => res.data);
        console.log({ res });
    };

    const handlePostData = async () => {
        const res = await axios.post('/api/test/put-item', {
            id: postId,
            data: postData
        }).then(res => res.data);
        console.log({ res });
    };

    const handleGetData = async () => {
        const res = await axios.get(`/api/test/get-item/${getId}`).then(res => res.data);
        console.log({ res });
    };

    const handleGetAllData = async () => {
        const res = await axios.get('/api/test/get-all-items').then(res => res.data)
        console.log({res})
    }

    return (
        <>
            <div>App.tsx</div>
            <button onClick={handleGet}>backend-button</button>
            <button onClick={handleCreateTable}>Table create</button>
            <div>
                <input
                    type="text"
                    placeholder="Post ID"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Post Data"
                    value={postData}
                    onChange={(e) => setPostData(e.target.value)}
                />
                <button onClick={handlePostData}>post data</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Get ID"
                    value={getId}
                    onChange={(e) => setGetId(e.target.value)}
                />
                <button onClick={handleGetData}>get data</button>
            </div>
            <div>
                <button onClick={handleGetAllData}>get All</button>
            </div>
        </>
    );
}

export default App;