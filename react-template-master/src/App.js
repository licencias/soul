import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { smwebsdk } from '@soulmachines/smwebsdk';
import { SoulMachinesProvider } from '@contexts/SoulMachines';
import * as ActionTypes from '@constants/ActionTypes';
import { isAudioOnlySupported, isCompatible } from '@utils/device';

import GlobalStyle from '@style/global';
import theme from '@style/theme';

import Header from '@components/Header';
import Footer from '@components/Footer';
import PersonaVideo from '@components/PersonaVideo';
import IntroPanel from '@components/IntroPanel';
import Transcript from '@components/Transcript/Transcript';
import Container from '@components/Container';
import { FooterInfoPanel } from '@components/Panels/InfoPanel';

class App extends Component {

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
    }

    componentDidMount() {
        // Detect device capabilities
        smwebsdk.DetectCapabilities().then((result) => {
            this.props.setFeatures({
                hasCamera: result.hasCamera,
                hasMicrophone: result.hasMicrophone,
                isBrowserSupported: result.isBrowserSupported && isCompatible(),
                isAudioOnlySupported: isAudioOnlySupported()
            });
        });
    }

    handlePanelChange(direction) {
        this.props.changePanel(direction);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <SoulMachinesProvider>
                    <GlobalStyle />

                    {this.renderContainer()}
                </SoulMachinesProvider>
            </ThemeProvider>
        );
    }

    renderContainer() {
        const {
            isConnected,
            isTranscriptOpen,
            infoPanels,
            activePanelIndex
        } = this.props;

        const panel = infoPanels[activePanelIndex];
        const isInfoPanelOpen = Boolean(isConnected && !isTranscriptOpen && panel);
        return (
            <Fragment>
                <Container isInfoPanelOpen={isInfoPanelOpen}>
                    <PersonaVideo />

                    <Header />

                    {!isConnected && <IntroPanel />}

                    <Transcript isOpen={isTranscriptOpen} />

                    <Footer />

                    {!isConnected &&
                        console.log("isConnected")
                    }

                    {isInfoPanelOpen && <FooterInfoPanel
                        panel={panel}
                        activePanelIndex={activePanelIndex}
                        totalPanelCount={infoPanels.length}
                        onPanelChange={this.handlePanelChange}
                        isOpen={isInfoPanelOpen}
                    />}
                </Container>

                <div style={{
                    position: "relative",
                    float:"right",
                    top:"25px",
                    left: "-25px",
                    display: "flex",
                    items: "center",
                    height:"40px"
                }}>
                    <img src="https://www.soulmachines.com/wp-content/uploads/sm-logo-std.png" />
                </div>
                <div style={{
                    position: "relative",
                    float:"right",
                    top:"100px",
                    left: "220px",
                    display: "flex",
                    items: "center",
                    height:"70px"
                }}>
                    <img src="https://www.everis.com/sites/all/themes/everis/logo.png" />
                </div>
            </Fragment >
        );
    }
}

function mapStateToProps(state) {
    return {
        isVideoEnabled: state.isVideoEnabled,
        isConnected: state.isConnected,
        isTranscriptOpen: state.isTranscriptOpen,
        infoPanels: state.infoPanels,
        activePanelIndex: state.activePanelIndex
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setFeatures: (features) => dispatch({
            type: ActionTypes.SET_FEATURES,
            features: features
        }),

        changePanel: (direction) => dispatch({
            type: ActionTypes.CHANGE_PANEL,
            direction: direction
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
