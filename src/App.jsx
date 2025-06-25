// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const imgs = [];
        console.log(event.target.files);

        // for (var ind = 0; ind < event.target.files["length"]; ind++) {
        //     const file = event.target.files[ind];
        //     if (typeof file != "number") {
        //         const reader = new FileReader();
        //         reader.onload = function () {
        //             imgs.push(reader.result);
        //         };
        //         console.log(ind, file);
        //         const options = {
        //             maxSizeMB: 0.8, // ファイルサイズの最大値 (MB)
        //             maxWidthOrHeight: 1920, // 画像の最大幅または高さ
        //             useWebWorker: true, // Web Workerを使用してパフォーマンスを向上
        //         };
        //         const compressedFile = await imageCompression(file, options);
        //         console.log(compressedFile);

        //         reader.readAsDataURL(compressedFile);
        //     }
        // }
        console.log(imgs);

        setSelectedFiles(event.target.files);
        setAnalysisResults([]);
        setError("");
    };

    const handleAnalyzeClick = async () => {
        if (!selectedFiles) {
            setError("画像ファイルを選択してください。");
            return;
        }

        setIsLoading(true);
        setError("");

        // let compresseFiles = [];
        // try {
        //     for (let file in selectedFiles) {
        //         compresseFiles.push();
        //     }
        // } catch (e) {
        //     setError("画像圧縮中にエラーが発生しました" + (e.response?.data?.detail || ""));
        //     setIsLoading(false);
        //     return;
        // }
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => formData.append("image_paths", file));
        // formData.append("image_binaries", selectedFiles);

        try {
            // バックエンドAPIのURL (Hugging Face SpacesのURLに置き換える)
            const API_URL = "https://wai572-board-recognizer.hf.space/analyze/";
            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
            setAnalysisResults(response.data);
        } catch (err) {
            setError("分析中にエラーが発生しました。" + (err.response?.data?.detail || ""));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Bridge Card Recognizer</h1>
            <p>ブリッジのプレイ中の写真をアップロードして、手札を認識します。</p>

            <div className="controls">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                <button onClick={handleAnalyzeClick} disabled={isLoading}>
                    {isLoading ? "分析中..." : "分析開始"}
                </button>
            </div>

            <div className="file-list">
                <h3>選択中のファイル:</h3>
                {selectedFiles.length === 0 && <p>ファイルが選択されていません。</p>}
                <ul>
                    {(new Array(selectedFiles)).map((file, index) => (
                        <li key={index}>
                            {file.name}
                            {/* <button className="remove-btn" onClick={() => handleRemoveFile(file.name)}>削除</button> */}
                        </li>
                    ))}
                </ul>
            </div>

            {error && <p className="error">{error}</p>}

            {/* 解析結果の表示 */}
            {analysisResults.length > 0 && (
                <div className="results-container">
                    <h2>解析結果</h2>
                    {analysisResults.map((result, index) => (
                        <div key={index} className="result-item">
                            <h3>{result.filename}</h3>
                            {/* ここで各画像の結果を適切に表示する */}
                            <pre>{JSON.stringify(result.hands, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
