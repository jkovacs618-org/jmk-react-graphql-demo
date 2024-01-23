import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSideMenu } from '../../../contexts/SideMenuContext';

import {
  IconName,
  IconLookup,
  IconDefinition,
  findIconDefinition,
  IconPrefix
} from '@fortawesome/fontawesome-svg-core'

type SideMenuLinkProps = {
  label: string,
  path: string,
  prefix: string,
  icon: string
}

const SideMenuLink: React.FC<SideMenuLinkProps> = (props: SideMenuLinkProps) => {
  const { closeMenu } = useSideMenu();

  // Must cast props.icon (string) to IconName (literals, not strings) for TypeScript not to complain/error.
  // Must cast props.prefix (string) to IconPrefix (literals, not strings) for TypeScript not to complain/error.
  const iconLookup: IconLookup = { prefix: props.prefix as IconPrefix, iconName: props.icon as IconName }
  const iconDefinition: IconDefinition = findIconDefinition(iconLookup)

  return (
    <div className="side-menu-link pt-1">
      <NavLink to={props.path} className="" onClick={closeMenu}>
        <div className="flex gap-1 py-3 px-4 hover:bg-slate-100 text-slate-600">
          <div className="w-8 mr-3 text-center">
            <FontAwesomeIcon icon={iconDefinition} className="text-lg" />
          </div>
          <div>
            {props.label}
          </div>
        </div>
      </NavLink>
    </div>
  )
}

export default SideMenuLink
