// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import "./App.css";

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const imgs = [];
        console.log(event.target.files);

        for (var ind = 0; ind < event.target.files["length"]; ind++) {
            const file = event.target.files[ind];
            if (typeof file != "number") {
                const reader = new FileReader();
                reader.onload = function () {
                    imgs.push(reader.result);
                };
                console.log(ind, file);
                const options = {
                    maxSizeMB: 1, // ファイルサイズの最大値 (MB)
                    maxWidthOrHeight: 1920, // 画像の最大幅または高さ
                    useWebWorker: true, // Web Workerを使用してパフォーマンスを向上
                };
                const compressedFile = await imageCompression(file, options);
                console.log(compressedFile);

                reader.readAsDataURL(compressedFile);
            }
        }
        console.log(imgs);

        setSelectedFiles(imgs);
        setAnalysisResult(null);
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
        formData.append("image_paths", selectedFiles);

        try {
            // バックエンドAPIのURL (Hugging Face SpacesのURLに置き換える)
            const API_URL = "https://wai572-board-recognizer.hf.space/analyze/";
            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            print(response);
            setAnalysisResult(response.data);
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

            {error && <p className="error">{error}</p>}

            {analysisResult && (
                <div className="results">
                    <h2>認識結果 ({analysisResult.filename})</h2>
                    <div className="hands-grid">
                        <div className="hand">
                            <h3>North</h3>
                            <p>{analysisResult.hands.north.join(", ")}</p>
                        </div>
                        <div className="hand">
                            <h3>South</h3>
                            <p>{analysisResult.hands.south.join(", ")}</p>
                        </div>
                        <div className="hand">
                            <h3>West</h3>
                            <p>{analysisResult.hands.west.join(", ")}</p>
                        </div>
                        <div className="hand">
                            <h3>East</h3>
                            <p>{analysisResult.hands.east.join(", ")}</p>
                        </div>
                    </div>
                    {/* ここにDDSの結果やエクスポートボタンを実装 */}
                </div>
            )}
        </div>
    );
}

export default App;
