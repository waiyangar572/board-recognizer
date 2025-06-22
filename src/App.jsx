// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setAnalysisResult(null);
        setError("");
    };

    const handleAnalyzeClick = async () => {
        if (!selectedFile) {
            setError("画像ファイルを選択してください。");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setIsLoading(true);
        setError("");

        try {
            // バックエンドAPIのURL (Hugging Face SpacesのURLに置き換える)
            const API_URL = "https://huggingface.co/spaces/wai572/board-recognizer";
            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
                <input type="file" accept="image/*" onChange={handleFileChange} />
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
