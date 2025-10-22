import React from 'react';
import { Card, Input, Switch, Slider, Typography, Space, Badge } from 'antd';
import { EnvironmentOutlined, FireOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TouristControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLocateMe: () => void;
  hasLocation: boolean;
  nearMeOnly: boolean;
  onToggleNearMeOnly: (checked: boolean) => void;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: (checked: boolean) => void;
  showTourismHeat: boolean;
  onToggleTourismHeat: (checked: boolean) => void;
  resultsCount: number;
}

const TouristControls: React.FC<TouristControlsProps> = ({
  searchQuery,
  onSearchChange,
  onLocateMe,
  hasLocation,
  nearMeOnly,
  onToggleNearMeOnly,
  radiusKm,
  onRadiusChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  showTourismHeat,
  onToggleTourismHeat,
  resultsCount,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        width: 320,
        maxWidth: 'calc(100vw - 32px)'
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
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <Input.Search
            placeholder="Buscar por nombre o categoría"
            allowClear
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            enterButton
          />

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge status={hasLocation ? 'success' : 'default'}>
              <a onClick={onLocateMe} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <EnvironmentOutlined />
                <Text style={{ margin: 0 }}>{hasLocation ? 'Mi ubicación' : 'Ubicarme'}</Text>
              </a>
            </Badge>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Switch size="small" checked={nearMeOnly} onChange={onToggleNearMeOnly} />
              <Text style={{ margin: 0 }}>Solo cercanos</Text>
            </div>
          </div>

          {nearMeOnly && (
            <div>
              <Text style={{ fontSize: 12, color: '#666' }}>Radio: {radiusKm} km</Text>
              <Slider
                min={1}
                max={15}
                step={1}
                value={radiusKm}
                onChange={(v) => onRadiusChange(v as number)}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Switch size="small" checked={favoritesOnly} onChange={onToggleFavoritesOnly} />
              {favoritesOnly ? <HeartFilled style={{ color: '#eb2f96' }} /> : <HeartOutlined />}
              <Text style={{ margin: 0 }}>Favoritos</Text>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Switch size="small" checked={showTourismHeat} onChange={onToggleTourismHeat} />
              <FireOutlined style={{ color: showTourismHeat ? '#fa8c16' : undefined }} />
              <Text style={{ margin: 0 }}>Calor turístico</Text>
            </div>
          </div>

          <Text style={{ fontSize: 12, color: '#888' }}>Resultados: {resultsCount}</Text>
        </Space>
      </Card>
    </div>
  );
};

export default TouristControls;
