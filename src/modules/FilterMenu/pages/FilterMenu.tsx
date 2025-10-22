//
import React, {  } from "react";
import { Switch, Card, Space, Collapse } from "antd";
import {
  EnvironmentOutlined,
  BorderOutlined,
  CarOutlined,
  CloudOutlined,
} from "@ant-design/icons"; // Iconos de Ant Design
import { FaSkullCrossbones, FaCarCrash  } from "react-icons/fa";
import { GiRobber } from "react-icons/gi";
import "./FilterMenu.css";

interface FilterMenuProps {
  onToggleBoundaries: (checked: boolean) => void;
  onToggleColors: (checked: boolean) => void;
  showBoundaries: boolean;
  showColors: boolean;
  showCicloRuta: boolean;
  showRios: boolean;
  showHomicidios: boolean;
  showHomicidios2023: boolean;
  showRobos2019: boolean;
  showRobos2020: boolean;
  showAccidentesA2018: boolean;
  showAccidentesA2019: boolean;
  onToggleCicloRutas: (checked: boolean) => void;
  onToggleRios: (checked: boolean) => void;
  onToggleHomicidios: (checked: boolean) => void;
  onToggleHomicidios2023: (checked: boolean) => void;
  onToggleRobos2019: (checked: boolean) => void;
  onToggleRobos2020: (checked: boolean) => void;
  onToggleAccidentesA2018: (checked: boolean) => void;
  onToggleAccidentesA2019: (checked: boolean) => void;
}
// AntD v5: use Collapse.items API instead of Panel children


const FilterMenu: React.FC<FilterMenuProps> = ({
  onToggleBoundaries,
  onToggleColors,
  showBoundaries,
  showColors,
  showCicloRuta,
  showRios,
  showHomicidios,
  showHomicidios2023,
  onToggleCicloRutas,
  onToggleRios,
  onToggleHomicidios,
  onToggleHomicidios2023,
  showRobos2019,
  showRobos2020,
  onToggleRobos2019,
  onToggleRobos2020,
  showAccidentesA2018,
  showAccidentesA2019,
  onToggleAccidentesA2018,
  onToggleAccidentesA2019,
}) => {
  const handleBoundariesChange = (checked: boolean) => {
    onToggleBoundaries(checked);
  };

  const handleColorsChange = (checked: boolean) => {
    onToggleColors(checked);
  };

  const handleCicloRuta = (checked: boolean) => {
    onToggleCicloRutas(checked);
  };

  const handleRios = (checked: boolean) => {
    onToggleRios(checked);
  };

  const handleHomicidios = (checked: boolean) => {
    onToggleHomicidios(checked);
  };

  const handleHomicidios2023 = (checked: boolean) => {
    onToggleHomicidios2023(checked);
  };

  const handleRobos2019 = (checked: boolean) => {
    onToggleRobos2019(checked);
  };

  const handleRobos2020= (checked: boolean) => {
    onToggleRobos2020(checked);
  };

  const handleAccidentesA2018= (checked: boolean) => {
    onToggleAccidentesA2018(checked);
  };

  const handleAccidentesA2019= (checked: boolean) => {
    onToggleAccidentesA2019(checked);
  };


  return (
    <div
      style={{
        margin: "10px",
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
        width: "300px",
        animation: "slideInLeft 0.5s ease-out",
      }}
    >
      <Card
        title={
          <span style={{ 
            fontSize: "16px", 
            fontWeight: "600",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🗺️ Capas del Mapa
          </span>
        }
        bordered={false}
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.98)",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Switch para Marcadores populares x comuna */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <EnvironmentOutlined
                style={{
                  color: "#000000",
                  fontSize: "20px",
                  marginRight: "10px",
                }}
              />
              <span>Marcadores populares</span>
            </span>
            <Switch
              checked={showBoundaries}
              onChange={handleBoundariesChange}
            />
          </div>

          {/* Switch para Límites de comunas */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <BorderOutlined
                style={{
                  color: "#52c41a",
                  fontSize: "20px",
                  marginRight: "10px",
                }}
              />
              <span>Límites de comunas</span>
            </span>
            <Switch checked={showColors} onChange={handleColorsChange} />
          </div>

          {/* Switch para Ciclo ruta */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <CarOutlined
                style={{
                  color: "#FFDB58",
                  fontSize: "20px",
                  marginRight: "10px",
                }}
              />
              <span>Ciclo ruta</span>
            </span>
            <Switch checked={showCicloRuta} onChange={handleCicloRuta} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <CloudOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "20px",
                  marginRight: "10px",
                }}
              />
              <span>Rios</span>
            </span>
            <Switch checked={showRios} onChange={handleRios} />
          </div>

          <Collapse
            bordered={false}
            style={{ marginBottom: "2px", border: "1px solid #ccc", borderRadius: "8px" }}
            items={[
              {
                key: 'homicidios',
                label: 'Homicidios',
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <FaSkullCrossbones
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Homicidios 2022</span>
                      </span>
                      <Switch checked={showHomicidios} onChange={handleHomicidios} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <FaSkullCrossbones
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Homicidios 2023</span>
                      </span>
                      <Switch
                        checked={showHomicidios2023}
                        onChange={handleHomicidios2023}
                      />
                    </div>
                  </div>
                )
              }
            ]}
          />

          <Collapse
            bordered={false}
            style={{ marginBottom: "2px", border: "1px solid #ccc", borderRadius: "8px" }}
            items={[
              {
                key: 'robos',
                label: 'Robos',
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <GiRobber
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Robos 2018</span>
                      </span>
                      <Switch checked={showRobos2019} onChange={handleRobos2019} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <GiRobber
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Robos 2019</span>
                      </span>
                      <Switch checked={showRobos2020} onChange={handleRobos2020} />
                    </div>
                  </div>
                )
              }
            ]}
          />

          <Collapse
            bordered={false}
            style={{ marginBottom: "2px", border: "1px solid #ccc", borderRadius: "8px" }}
            items={[
              {
                key: 'accidentes',
                label: 'Accidentes Automovilísticos',
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <FaCarCrash
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Accidentes 2018</span>
                      </span>
                      <Switch checked={showAccidentesA2018} onChange={handleAccidentesA2018} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <FaCarCrash
                          style={{
                            color: "#f5222d",
                            fontSize: "20px",
                            marginRight: "10px",
                          }}
                        />
                        <span>Accidentes 2019</span>
                      </span>
                      <Switch checked={showAccidentesA2019} onChange={handleAccidentesA2019} />
                    </div>
                  </div>
                )
              }
            ]}
          />
    
        </Space>
      </Card>
    </div>
  );
};

export default FilterMenu;
