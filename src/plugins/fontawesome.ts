import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// FA Solid
import {
    faAngleDown as fasAngleDown,
    faAngleLeft as fasAngleLeft,
    faAngleRight as fasAngleRight,
    faCar as fasCar,
    faBars as fasBars,
    faBuildingUser as fasBuildingUser,
    faCircleUser as fasCircleUser,
    faCircleInfo as fasCircleInfo,
    faCircleCheck as fasCircleCheck,
    faCirclePlus as fasCirclePlus,
    faCircleNotch as fasCircleNotch,
    faHeartPulse as fasHeartPulse,
    faHouseChimney as fasHouseChimney,
    faLock as fasLock,
    faPencil as fasPencil,
    faPenToSquare as fasPenToSquare,
    faPeopleRoof as fasPeopleRoof,
    faRightFromBracket as fasRightFromBracket,
    faTableCells as fasTableCells,
    faTableCellsLarge as fasTableCellsLarge,
    faTimes as fasTimes,
    faTrashCan as fasTrashCan,
} from '@fortawesome/free-solid-svg-icons'

// FA Regular:
import { faCalendarDays as farCalendarDays } from '@fortawesome/free-regular-svg-icons'

// UI:
library.add(fasAngleDown)
library.add(fasAngleLeft)
library.add(fasAngleRight)
library.add(fasBars)
library.add(fasBuildingUser)
library.add(fasCar)
library.add(farCalendarDays)
library.add(fasCircleUser)
library.add(fasCircleInfo)
library.add(fasCircleCheck)
library.add(fasCirclePlus)
library.add(fasCircleNotch)
library.add(fasHeartPulse)
library.add(fasHouseChimney)
library.add(fasLock)
library.add(fasPencil)
library.add(fasPenToSquare)
library.add(fasPeopleRoof)
library.add(fasRightFromBracket)
library.add(fasTableCells)
library.add(fasTableCellsLarge)
library.add(fasTimes)
library.add(fasTrashCan)

export default FontAwesomeIcon
