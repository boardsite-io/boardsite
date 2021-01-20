import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import Tooltip from "@material-ui/core/Tooltip"
import { IconButton } from "@material-ui/core"

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
    <>
        <Tooltip
            id="tooltip"
            title="undo"
            TransitionProps={{ timeout: 0 }}
            placement="bottom">
            <IconButton
                id="iconButton"
                variant="contained"
                disabled={!canUndo}
                onClick={onUndo}>

                <UndoIcon id="iconButtonInner" />
            </IconButton>
        </Tooltip>
        <Tooltip
            id="tooltip"
            title="redo"
            TransitionProps={{ timeout: 0 }}
            placement="bottom">
            <IconButton
                id="iconButton"
                variant="contained"
                disabled={!canRedo}
                onClick={onRedo}>
                <RedoIcon id="iconButtonInner" />
            </IconButton>
        </Tooltip>
    </>
)

const mapStateToProps = state => {
    console.log(state);
    return {
        canUndo: state.boardControl.past.length > 0,
        canRedo: state.boardControl.future.length > 0
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUndo: () => dispatch(UndoActionCreators.undo()),
        onRedo: () => dispatch(UndoActionCreators.redo())
    }
}

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo)

export default UndoRedo