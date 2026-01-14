'use client';
import { useEffect, useState } from "react";

function TestZone() {
    const [data, SetData] = useState<{}>({});
    async function tryfunction() {
        try {
            const api = await fetch('/api/test/');
            SetData(await api.json());
        } catch (e) {
            console.error('Error fetching test API:', e);
        }
    }
    useEffect(() => {

        tryfunction();
    }, []);

    return (
        <div>
            {JSON.stringify(data)}
            <h1>Test Zone</h1>
            <p>This is a test page.</p>
        </div>
    );
}


export default TestZone;