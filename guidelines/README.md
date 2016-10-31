###Documentation and General Coding Guidelines

####All files shall be proceeded with the following header:
```
//************************************************************
//  **name.extension**                                      //
//  **PROJECT NAME**                                        //
//                                                          //
//  Created by **AUTHOR** on **CREATION DATE**              //
//  Copyright © 2016 **TEAM NAME**. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  **DATE**    **NAME**    **DESCRIPTION**                 //
//                                                          //
//************************************************************
```

####Below is an example where each **<>** has been replaced appropriately

```
//************************************************************
//  EventManager.swift                                      //
//  Messaging                                               //
//                                                          //
//  Created by Jeremy Carter on 6/15/16.                    //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  16Jun16     J. Carter   Initial Design                  //
//                                                          //
//************************************************************
```

####Proper Coding Style and class/function Documentation:
1. **No exclamation marks in comments.**
2. **(4)** Spaces for 'indent' style (NO TABS)
3. All .js files should have the following as the first line '/* jshint node: true */' to enable proper linting of the js file when using node as the architecture.
4. Opening and closing brackets on the same line with the exception of JS redirects/callbacks
5. Functions: applications, returns and parameters shall be properly documented. These descriptors shall contain their type.
6. Classes: application should be explained briefly and concisely.
7. Switch statements shall have opening and closing brackets for each case
8. Ternary if/else statements are allowable **iff** it doesn't impede readability. Verbosity is preferred over simplicity.
9. Any line of code that would be considered 'obfuscated' needs to have a preceding comment explaining what said line of code does.
10. Large lists of variables (enums specifically) should be sorted **alphabetically.**

___
####Example(1-4):
```swift
    /**
     Create a new event listener, not expecting information from the trigger

     - parameter (String)eventName:  Matching trigger eventNames will cause this listener to fire
     - parameter (Clojure)action:    The block of code you want executed when the event triggers
     */
    func listenTo(_ eventName: String, action: (()->()))
    {
        let newListener = EventListenerAction(callback: action)
        addListener(eventName, newEventListener: newListener)
    }
```
___
####Example(5-6):
```swift

    switch(var)
    {
        case 1:
        {
            var2 = (var == 1 ?) 1 : 0
        }
        case 2:
        {
            // Example code 2
        }
        default:
        {
            // Default stuffs
        }
    }
```
___
####Example(7):
```swift

    // Pack 4 bytes into an 32 int by shifting by multiples of 8
    // 1 << 3 = 8
    // 2 << 3 = 16
    // 3 << 3 = 24
    return (b3 << (3 << 3)) | (b2 << (2 << 3)) | (b1 << (1 << 3)) | (b0);
```
