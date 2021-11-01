use lok2::LokType;
use yew::{ Component, ComponentLink, Html,  events::{FocusEvent, KeyboardEvent}, html};
use yew_styles::{button::{Button}, forms::{form_input::{FormInput, InputType},form_textarea::FormTextArea}, styles::{Palette, Size, Style}};
use yew::InputData;

pub enum Msg {
    ToggleTranslation,
    ToggleCompression,
    Input(String)
}

enum LokTranslation{
    Lok2Utf8,
    Utf8_2Lok,
}

pub struct Model {
    input: String,
    output: String,
    compression : LokType,
    lok_translation : LokTranslation,
    link: ComponentLink<Self>,
}

impl Component for Model {
    type Message = Msg;

    type Properties = ();

    fn create(props: Self::Properties, link: yew::ComponentLink<Self>) -> Self {
        Model{input: "".to_string(), output: "".to_string(), compression: LokType::Uncompressed , lok_translation: LokTranslation::Utf8_2Lok, link }
    }

    fn update(&mut self, msg: Self::Message) -> yew::ShouldRender {
        match msg {
            Msg::ToggleCompression => {
                self.compression = match self.compression{
                    LokType::Compressed => LokType::Uncompressed,
                    LokType::Uncompressed => LokType::Compressed,
                };
                true
            }
            Msg::ToggleTranslation => {
                self.lok_translation = match self.lok_translation{
                    LokTranslation::Lok2Utf8 => LokTranslation::Utf8_2Lok,
                    LokTranslation::Utf8_2Lok => LokTranslation::Lok2Utf8,
                };
                true
            },
            Msg::Input(text) => {
                self.input = text.clone();
                let compression = self.compression.clone();
                self.output = match self.lok_translation {
                     LokTranslation::Lok2Utf8 => {
                        match lok2::from_lok_to_string(text.clone(), compression ){
                            Ok(r) => r,
                            Err(_) => "".to_string(),
                        }
                    }
                    ,
                    LokTranslation::Utf8_2Lok => lok2::from_string_to_lok(text.clone(), compression),
                };
                
                true
            },
        }
    }

    fn change(&mut self, _props: Self::Properties) -> yew::ShouldRender {
        todo!()
    }

    fn view(&self) -> Html {
        let lok_translation = match self.lok_translation{
            LokTranslation::Lok2Utf8 => "Lok => UTF-8",
            LokTranslation::Utf8_2Lok => "Lok <= UTF-8",
        };

        let lok_compressed = match self.compression{
            LokType::Compressed => "Compressed",
            LokType::Uncompressed => "Not Compressed",
        };
        
        html!{
        <div class="view">
            <Button
            onclick_signal=self.link.callback(move |_| Msg::ToggleCompression)
            class_name="toggle"
            // button_palette=Pallete::Standard
            button_style=Style::Outline
            button_size=Size::Medium
            >{lok_compressed}</Button>

            <Button
            onclick_signal=self.link.callback(move |_| Msg::ToggleTranslation)
            class_name="toggle"
            // button_palette=Pallete::Standard
            button_style=Style::Outline
            button_size=Size::Medium
            >{lok_translation}</Button>
            
            <br/>

            <FormTextArea
                oninput_signal = self.link.callback(|e: InputData| Msg::Input(e.value))
                placeholder="Type here your input"
                textarea_size=Size::Big
            />
            <br/>
            {&self.output}
            
        
        </div>
        }
    }
}

fn main() {
    yew::start_app::<Model>();
}
