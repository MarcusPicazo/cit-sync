import React from 'react';
import { Monitor, Laptop, Tablet, Cpu, Presentation, Projector } from 'lucide-react';

export const getResourceIcon = (id, size = 24, className = "") => {
  if (!id) return <Monitor size={size} className={className} />;
  const strId = String(id);
  if (strId.includes('canon')) return <Projector size={size} className={className} />;
  if (strId.includes('laptop')) return <Laptop size={size} className={className} />;
  if (strId.includes('tableta')) return <Tablet size={size} className={className} />;
  if (strId.includes('kit')) return <Cpu size={size} className={className} />;
  if (strId.includes('magic-board')) return <Presentation size={size} className={className} />;
  return <Monitor size={size} className={className} />;
};

export const formatUserName = (name, t) => {
  if (!name) return "";
  let str = String(name);
  if (str.startsWith('Usuario ')) {
    const role = str.split(' ')[1];
    return `${t('role_user')} ${String(t('role_' + role)).toLowerCase()}`;
  }
  return str;
};