import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text } from "@vizality/components"
import { TextArea } from "@vizality/components/settings"
import { close as CloseModal } from '@vizality/modal';

const FormTitle = getModuleByDisplayName('FormTitle')

module.exports = class LinksFlaggerModal extends React.PureComponent {
    constructor(props){
        super(props)
        self = this;
        this.state = {}
        this.countDown = 5
        
        // lol is this the right way? idk. idc.
        function count(){
            setTimeout(function(){
                console.log(self.countDown);
                if (self.countDown > 0){
                    self.countDown = self.countDown - 1;
                    self.forceUpdate();
                    count()
                }
            },1000)
        }
        count();
    }


    render() {

        return <>
            <Modal size={Modal.Sizes.SMALL} className="lf-modal-main">
                <Modal.Header>
                <FormTitle tag={FormTitle.Tags.H2} style={{margin: "0px"}}>Are you sure you want to do that?</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <Text>Are you sure you want to go to <b className={"flagged-link " + this.props.urltype}>{this.props.link}</b>? This site is a filtered site, continue at your own risk.</Text>
                </Modal.Content>
                <Modal.Footer justify={"justifyCenter--8YVyf"} wrap={"wrap-ZIn9Iy"}>
                    <Button size={Button.Sizes.XLARGE} color={Button.Colors.RED} onClick={()=>{
                        if (this.countDown <= 0){
                            require('electron').shell.openExternal(this.props.link);
                            CloseModal();
                        }
                    }}>{this.countDown == 0 ? "I'm sure." : `Wait (${this.countDown})`}</Button>
                    <div style={{margin: "5px"}}></div>
                    <Button size={Button.Sizes.XLARGE} color={Button.Colors.GREY} onClick={()=>{
                        CloseModal();
                    }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    }
}