import React from 'react';
import { Card, Button, Switch, Typography, Space, List } from 'antd';
import { 
  EnvironmentOutlined, 
  AimOutlined, 
  CloseCircleOutlined,
  RocketOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface RouteDestination {
  id: string;
  nombre: string;
  tipo: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  selected: boolean;
}

interface RouteSimulatorProps {
  routeModeActive: boolean;
  onToggleRouteMode: (active: boolean) => void;
  originPoint: { lat: number; lng: number } | null;
  onClearOrigin: () => void;
  destinations: RouteDestination[];
  onToggleDestination: (id: string) => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
}

const RouteSimulator: React.FC<RouteSimulatorProps> = ({
  routeModeActive,
  onToggleRouteMode,
  originPoint,
  onClearOrigin,
  destinations,
  onToggleDestination,
  onStartSimulation,
  isSimulating,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 16,
        zIndex: 1100,
        width: 320,
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <Card
        size="small"
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          background: 'rgba(255,255,255,0.96)',
        }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RocketOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              <Title level={5} style={{ margin: 0 }}>
                Simulador de Rutas
              </Title>
            </div>
            <Switch
              checked={routeModeActive}
              onChange={onToggleRouteMode}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>

          {routeModeActive && (
            <>
              <div style={{ background: '#f0f5ff', padding: 10, borderRadius: 8 }}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AimOutlined style={{ color: '#1890ff' }} />
                    <Text strong style={{ fontSize: 13 }}>
                      {originPoint ? 'Punto de Origen:' : 'Click en el mapa para origen'}
                    </Text>
                  </div>
                  {originPoint && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        📍 {originPoint.lat.toFixed(5)}, {originPoint.lng.toFixed(5)}
                      </Text>
                      <Button
                        size="small"
                        type="text"
                        icon={<CloseCircleOutlined />}
                        onClick={onClearOrigin}
                      >
                        Limpiar
                      </Button>
                    </div>
                  )}
                </Space>
              </div>

              {originPoint && destinations.length > 0 && (
                <>
                  <div>
                    <Text strong style={{ fontSize: 13 }}>
                      Destinos Sugeridos ({destinations.filter(d => d.selected).length} activos):
                    </Text>
                  </div>
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    <List
                      size="small"
                      dataSource={destinations.slice(0, 10)}
                      renderItem={(dest) => (
                        <List.Item
                          style={{
                            padding: '8px 0',
                            cursor: 'pointer',
                            background: dest.selected ? '#f6ffed' : 'transparent',
                            borderRadius: 6,
                            paddingLeft: 8,
                            paddingRight: 8,
                          }}
                          onClick={() => onToggleDestination(dest.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: dest.selected ? 600 : 400 }}>
                                {dest.nombre}
                              </div>
                              <div style={{ fontSize: 11, color: '#888' }}>
                                {dest.tipo} • {dest.distanceKm ? `${dest.distanceKm.toFixed(1)} km` : ''}
                              </div>
                            </div>
                            {dest.selected && (
                              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                            )}
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>

                  <Button
                    type="primary"
                    block
                    icon={<EnvironmentOutlined />}
                    onClick={onStartSimulation}
                    loading={isSimulating}
                    disabled={destinations.filter(d => d.selected).length === 0}
                  >
                    {isSimulating ? 'Simulando...' : 'Simular Rutas'}
                  </Button>
                  <Text style={{ fontSize: 11, color: '#999', textAlign: 'center', display: 'block' }}>
                    Click en los destinos para activarlos/desactivarlos
                  </Text>
                </>
              )}
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default RouteSimulator;
