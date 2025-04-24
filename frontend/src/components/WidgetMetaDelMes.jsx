import React from 'react';
const WidgetMetaDelMes = () => (
  <div className="widget">
    <h2>Meta del mes</h2>
    <p>50 Clientes / 100 clientes</p>
    <p>50% de la meta cumplida</p>
    <div className="progress-bar">
      <div className="progress" style={{ '--progress-width': '50%' }}></div>
    </div>
  </div>
);

export default WidgetMetaDelMes;
