import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './tool1.css'; 

export default function Tool1(props) {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFile1Change = (e) => {
        setFile1(e.target.files[0]);
    };

    const handleFile2Change = (e) => {
        setFile2(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log('Response:', response.data);
            setMessage(response.data.message);
            setDownloadUrl(`http://127.0.0.1:5000/download/${response.data.output_path}`);
        } catch (error) {
            console.error('Error uploading files:', error);
            setMessage('Error uploading files.');
        }
    };

    const resetForm = () => {
        setFile1(null);
        setFile2(null);
        setMessage('');
        setDownloadUrl('');
        document.getElementById('formFile1').value = null;
        document.getElementById('formFile2').value = null;
    };

    const handleDownload = () => {
        resetForm();
    };

    return (
        <Container>
            <h2>分红和超额误差</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="formFile1">
                    <Form.Label column sm={2}>
                        人工审核文件
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="file" onChange={handleFile1Change} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formFile2">
                    <Form.Label column sm={2}> 
                        机器审核文件
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="file" onChange={handleFile2Change} />
                    </Col>
                </Form.Group>

                <Button variant="primary" type="submit">
                    提交计算
                </Button>
            </Form>
            {message && <p>{message}</p>}
            {downloadUrl && (
                <Button variant="success" href={downloadUrl} download onClick={handleDownload}>
                    下载 分红和超额误差.xlsx
                </Button>
            )}
        </Container>
    );
}
