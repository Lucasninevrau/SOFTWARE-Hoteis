'use client'

export default function Rodape() {
    return (
        <div style={{ background: "#E8F1F2", height: "100px", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <p style={{ margin: 0, fontFamily: 'Times New Roman', fontSize: '16px', fontWeight: 'bold' }}>
                Copyright © 2024
            </p>
            <hr style={{ width: '70%', border: '1px solid #ccc', margin: '5px 0' }} />
            <p style={{ margin: 0, fontFamily: 'Times New Roman', textAlign: 'center', fontSize: '14px' }}>
                Crafted with care by: Lucas Fernandes, Rafaela Leite, Davy Marciel, João Pedro Loiola, and Eduardo Caetano.
            </p>
        </div>
    )
}
